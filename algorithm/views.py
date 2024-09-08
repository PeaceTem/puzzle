from django.shortcuts import render

# Create your views here.
from django.views.generic.base import TemplateView


from  .utils import find_path
import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# @csrf_exempt
def my_json_view(request):
    if request.method == 'POST':
        # Get JSON data from the request body
        try:
            data = json.loads(request.body)
            data = data.get('matrix', '1,2,3,4,5,6,7,8,0')  # Extract 'name' from the request data
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        
        # Create a response
        print("Data: ", data)
        state = tuple(map(int, data.split(',')))
        print(state)
        hole_path = find_path(state)

        response_data = {
            'message': f'{",".join(hole_path)}',
        }
        return JsonResponse(response_data)
    
    # If it's not a POST request, return an error
    return JsonResponse({'error': 'POST request required'}, status=405)



class HomePage(TemplateView):
    template_name = "algorithm/homepage.html"

    def get(self, request, *args, **kwargs):
        # get the sequence and spits out the output
        hole_path = find_path((0,2,3,7,5,4,6,1,8))
        context = self.get_context_data(**kwargs)
        context["hole_path"] = ", ".join(hole_path)
        return self.render_to_response(context)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["mercy"] = "This is her name! Her name is mercy"
        return context