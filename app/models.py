from django.contrib.auth.models import User
from django.db import models

# Create your models here.


class ToDoItem(models.Model):
    # These variables are being declared now, you don't have to have like String or whatever in front.
    # This is called "Dynamic typing"
    # Java is "Static typed" because you have to prefix every variable with

    name = models.CharField(max_length=20)  # Name of the item
    description = models.CharField(max_length=100, null=True)  # Description of the item
    owner = models.ForeignKey(User) # The owner of this item
    completed = models.BooleanField(default=False)  # Is this item completed yet?
    color = models.CharField(max_length=10, default="default") # Color of the Task.
    category = models.CharField(max_length=10, null=True) # Category of the Task.
