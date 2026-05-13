from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .hybrid import HybridAnalyzer

analyzer = HybridAnalyzer()

class AnalyzeView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        payload = request.data.get('payload', '')
        result = analyzer.analyze(payload)
        return Response(result)