# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_todoitem_color'),
    ]

    operations = [
        migrations.AddField(
            model_name='todoitem',
            name='category',
            field=models.CharField(default=b'', max_length=10),
            preserve_default=True,
        ),
    ]
