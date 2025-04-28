from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Todo(models.Model):
    title = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    
    def __str__(self):
        return self.title