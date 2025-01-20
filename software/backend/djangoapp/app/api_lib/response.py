from django.http import JsonResponse

def json_success_response(*args, data=None, message='success', **kwargs):
  response_data = {
    'success': True,
    'message': message,
    'payload': data,
  }

  return JsonResponse(response_data)

def json_error_response(*args, data=None, message='error', **kwargs):
  response_data = {
    'success': False,
    'message': message,
    'payload': data,
  }

  response_object = JsonResponse(response_data)
  response_object.status_code = 500
  return response_object
