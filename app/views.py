from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, render_to_response, redirect
from django.template import RequestContext

import requests

from app.models import ToDoItem
# Regular Views

def index(request):
    if request.user.is_authenticated():
        return redirect('tasks')

    return render(request, 'app/index.html')

@login_required(login_url="/login/")
def task_list(request):
    
    tasks = ToDoItem.objects.filter(owner=request.user)
    
    return render_to_response('app/tasks/tasks.html', {'tasks': tasks}, context_instance=RequestContext(request))

@login_required(login_url="/login/")
def add_task(request):

    if request.POST:
        if not request.POST.get('name'):
            return render_to_response('app/tasks/add.html', {'name_req': True,
                                                             'description': request.POST.get('description')},
                                      context_instance=RequestContext(request))

        task = ToDoItem(name=request.POST.get('name'), description=request.POST.get('description'), category=request.POST.get('category'), owner=request.user,
                        color=request.POST.get('color'))
        task.save()

        return redirect('tasks')

    return render_to_response('app/tasks/add.html', context_instance=RequestContext(request))

@login_required(login_url="/login/")
def task_detail(request, task_id):
    task = ToDoItem.objects.get(pk=task_id)

    if task.owner == request.user:
        if request.POST:
            if request.POST.get('completed'):
                if request.POST.get('completed') == 'on':
                    task.completed = True
                else:
                    task.completed = False

            if request.POST.get('color'):
                task.color = request.POST.get('color')

            task.save()
            return redirect('tasks')

        return render_to_response('app/tasks/detail.html', {'task': task}, context_instance=RequestContext(request))

    else:
        return redirect('tasks')

@login_required(login_url='/login/')
def task_delete(request, task_id):
    task = ToDoItem.objects.get(pk=task_id)

    if task.owner == request.user:
        task.delete()

    return redirect('tasks')


# Authentication Views
def login_user(request):
    state = ""
    username = ''

    if request.POST:
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            if user.is_active:
                login(request, user)

                if not request.POST.get('next'):
                    return redirect('index')
                else:
                    return redirect(request.POST.get('next'))
            else:
                state = "Error! Account is not active."
        else:
            state = "Your username and/or password was incorrect!"

    return render_to_response('app/login.html', {'state': state, 'username': username},
                              context_instance=RequestContext(request))

def logout_user(request):
    if request.user and request.user.is_authenticated():
        logout(request)

    return redirect('index')




