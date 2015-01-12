# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_auto_20150109_2110'),
    ]

    operations = [
        migrations.AlterField(
            model_name='todoitem',
            name='description',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
