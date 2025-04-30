from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Todo(models.Model):
    title = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    
    # 追加項目
    created_at = models.DateTimeField(auto_now_add=True)    # 作成日時自動生成
    due_date = models.DateField(null=True, blank=True)      # 任意の期限日
    
    def __str__(self):
        return self.title