import re
import torch
import torch.nn as nn
import subprocess
import json

class LSTMDetector(nn.Module):
    def __init__(self, vocab_size=10000, embedding_dim=128, hidden_dim=64):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embedding_dim, padding_idx=0)
        self.lstm = nn.LSTM(embedding_dim, hidden_dim, batch_first=True, bidirectional=True, dropout=0.2)
        self.fc = nn.Linear(hidden_dim * 2, 1)
        self.sigmoid = nn.Sigmoid()
    
    def forward(self, x):
        emb = self.embedding(x)
        lstm_out, _ = self.lstm(emb)
        last_out = lstm_out[:, -1, :]
        out = self.fc(last_out)
        return self.sigmoid(out).squeeze()

class HybridAnalyzer:
    def __init__(self):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = LSTMDetector()
        self.model.load_state_dict(torch.load('ml_model/weights.pth', map_location=self.device))
        self.model.to(self.device)
        self.model.eval()
    
    def tokenize(self, text):
        tokens = [ord(c) % 10000 for c in text[:100]]
        return tokens + [0] * (100 - len(tokens))
    
    def ml_predict(self, payload):
        tokens = torch.tensor([self.tokenize(payload)]).to(self.device)
        with torch.no_grad():
            score = self.model(tokens).item()
        return score
    
    def sast_scan(self, payload):
        # Simulate Semgrep rules
        xss_patterns = [r'<script', r'on\w+\s*=', r'javascript:', r'alert\(', r'prompt\(']
        sqli_patterns = [r"' OR '1'='1", r"UNION SELECT", r"'; DROP TABLE", r"'--"]
        
        findings = []
        for pattern in xss_patterns:
            if re.search(pattern, payload, re.IGNORECASE):
                findings.append({'type': 'XSS', 'pattern': pattern})
        for pattern in sqli_patterns:
            if re.search(pattern, payload, re.IGNORECASE):
                findings.append({'type': 'SQLi', 'pattern': pattern})
        return findings
    
    def analyze(self, payload):
        sast_findings = self.sast_scan(payload)
        ml_score = self.ml_predict(payload)
        
        is_vulnerable = len(sast_findings) > 0 or ml_score > 0.7
        
        return {
            'payload': payload,
            'sast_findings': sast_findings,
            'ml_confidence': round(ml_score, 3),
            'is_vulnerable': is_vulnerable,
            'risk_level': 'HIGH' if is_vulnerable else 'LOW'
        }