from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Todo(models.Model):
    PRIORITY_CHOICES = [
        (1, '最優先'),
        (2, '重要'),
        (3, '普通'),
        (4, '低'),
    ]
    
    title = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    
    # 追加項目
    created_at = models.DateTimeField(auto_now_add=True)    # 作成日時自動生成
    due_date = models.DateField(null=True, blank=True)      # 任意の期限日
    priority = models.IntegerField(choices=PRIORITY_CHOICES, default=3)  # 優先度
    
    def __str__(self):
        return self.title