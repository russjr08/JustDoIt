# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_todoitem'),
    ]

    operations = [
        migrations.AddField(
            model_name='todoitem',
            name='color',
            field=models.CharField(default=b'default', max_length=10),
            preserve_default=True,
        ),
    ]
