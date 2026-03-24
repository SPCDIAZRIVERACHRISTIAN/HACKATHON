from django.db import models

# Create your models here.
class Team(models.Model):
    name = models.CharField(max_length=150, unique=True)
    project_name = models.CharField(max_length=200, blank=True)
    score = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.project_name})"
