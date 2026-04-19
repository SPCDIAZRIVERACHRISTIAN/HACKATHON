from django.db import models
from django.conf import settings
from decimal import Decimal

class Team(models.Model):
    name = models.CharField(max_length=150, unique=True)
    project_name = models.CharField(max_length=200, blank=True)
    mentor_name = models.CharField(max_length=200, blank=True)
    score = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-score", "name"]

    def __str__(self):
        return f"{self.name} ({self.project_name})"

    def calculate_average_score(self):
        scores = self.judgings.all()
        if not scores:
            self.score = 0
        else:
            # Each weighted_score is 1-5. Multiply by 20 to get 20-100%
            total_percentage = sum(s.weighted_score * 20 for s in scores)
            self.score = total_percentage / len(scores)
        self.save()

class Score(models.Model):
    WEIGHTS = {
        'technical': Decimal('0.30'),
        'creativity': Decimal('0.25'),
        'impact': Decimal('0.20'),
        'presentation': Decimal('0.15'),
        'ux': Decimal('0.10'),
    }

    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="judgings")
    judge = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    technical = models.IntegerField(default=1) # 1-5
    creativity = models.IntegerField(default=1) # 1-5
    impact = models.IntegerField(default=1) # 1-5
    presentation = models.IntegerField(default=1) # 1-5
    ux = models.IntegerField(default=1) # 1-5
    
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('team', 'judge')

    @property
    def weighted_score(self):
        return (
            Decimal(str(self.technical)) * self.WEIGHTS['technical'] +
            Decimal(str(self.creativity)) * self.WEIGHTS['creativity'] +
            Decimal(str(self.impact)) * self.WEIGHTS['impact'] +
            Decimal(str(self.presentation)) * self.WEIGHTS['presentation'] +
            Decimal(str(self.ux)) * self.WEIGHTS['ux']
        )

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.team.calculate_average_score()

class HackathonEvent(models.Model):
    label = models.CharField(max_length=200)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "start_time"]

    def __str__(self):
        return self.label

class Task(models.Model):
    DEFAULT_TASKS = [
        "Challenge 1: Build the Application Foundation",
        "Challenge 2: Create the User Prompt Experience",
        "Challenge 3: Connect the Application to the AI API",
        "Challenge 4: Handle and Store the Raw AI Response",
        "Challenge 5: Process and Clean the Data",
        "Challenge 6: Convert the Data into Flashcards",
        "Challenge 7: Display the Flashcards in the Application",
        "Challenge 8: Add Flashcard Navigation",
        "Challenge 9: Handle Errors and Edge Cases",
        "Challenge 10: Improve Usability and Presentation",
    ]

    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="tasks")
    label = models.CharField(max_length=200)
    is_done = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return f"{self.team.name}: {self.label} ({'Done' if self.is_done else 'Pending'})"
