from django.contrib.auth.backends import RemoteUserBackend


# Credit where its due: http://stackoverflow.com/questions/1057149/django-users-and-authentication-from-external-source
from django.contrib.auth.models import User
import requests


class KronosRemoteUserBackend(RemoteUserBackend):
    create_unknown_user = False

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None


    def authenticate(self, username=None, password=None):
        data = {'username': username, 'password': password}

        r = requests.post('http://auth.kronosad.com/api/login/', data)
        if r.json()['message'] == 'Authentication Successful.':
            try:
                user = User.objects.get(username=username)
                user.is_active = True
                user.save()

            except User.DoesNotExist:
                user = User.objects.create_user(username, '', '')

            return user
        elif r.json()['message'] == 'Account is disabled.':
            try:
                user = User.objects.get(username=username)
                user.is_active = False
                user.save()

            except User.DoesNotExist:
                user = User.objects.create_user(username, '', '')

            return user
        return None



