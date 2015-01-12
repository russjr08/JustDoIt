from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    url(r'^$', 'app.views.index', name='index'),
    url(r'^admin/', include(admin.site.urls)),

    # Auth URLs
    url(r'^login/$', 'app.views.login_user', name='login'),
    url(r'^logout/$', 'app.views.logout_user', name='logout'),

    url(r'^tasks/$', 'app.views.task_list', name='tasks'),
    url(r'^tasks/add/$', 'app.views.add_task', name='add_task'),
    url(r'^tasks/modify/(?P<task_id>\d)/$', 'app.views.task_detail', name='task_detail'),
    url(r'^tasks/delete/(?P<task_id>\d)/$', 'app.views.task_delete', name='task_delete'),

)
