from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class AnalyzeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        payload = request.data.get('payload', '')
        # Simplified analysis (without ML for now)
        is_vulnerable = '<script>' in payload or "' OR '1'='1" in payload
        return Response({
            'payload': payload,
            'is_vulnerable': is_vulnerable,
            'risk_level': 'HIGH' if is_vulnerable else 'LOW'
        })