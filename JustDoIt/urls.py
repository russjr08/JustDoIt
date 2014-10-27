from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'JustDoIt.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^$', 'app.views.index'),
    url(r'^demo/$', 'app.views.demo'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'api/items/$', 'app.views.api_get_items'),
    url(r'api/items/add/$', 'app.views.api_add_item'),
    url(r'api/items/modify/$', 'app.views.api_modify_item'),
    url(r'api/items/delete/$', 'app.views.api_delete_item'),
)
