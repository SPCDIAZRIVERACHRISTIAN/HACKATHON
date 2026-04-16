from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.db import models

# Create your models here.
class Users(AbstractUser):
    REQUIRED_FIELDS = []
    STUDENT = "student"
    JUDGE = "judge"
    ADMIN = "admin"

    ROLE_CHOICES = [
        (STUDENT, "Student"),
        (JUDGE, "Judge"),
        (ADMIN, "Admin"),
    ]
    
    email = models.EmailField(blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ADMIN)
    team = models.ForeignKey(
        "teams.Team",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="users",
    )

    def clean(self):
        super().clean()

        if self.role == self.STUDENT and self.team is None:
            raise ValidationError({"team": "Students must belong to a team."})

        if self.role == self.JUDGE and self.team is not None:
            raise ValidationError({"team": "Judges cannot belong to a team."})

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
