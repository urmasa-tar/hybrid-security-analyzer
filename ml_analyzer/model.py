# ml_analyzer/model.py
import torch
import torch.nn as nn

class LSTMDetector(nn.Module):
    """
    LSTM модель для детектирования XSS и SQLi инъекций
    Архитектура основана на современных исследованиях[citation:5][citation:9]
    """
    def __init__(self, vocab_size=10000, embedding_dim=128, hidden_dim=64, num_layers=2):
        super(LSTMDetector, self).__init__()
        
        self.embedding = nn.Embedding(vocab_size, embedding_dim, padding_idx=0)
        self.lstm = nn.LSTM(
            input_size=embedding_dim,
            hidden_size=hidden_dim,
            num_layers=num_layers,
            batch_first=True,
            dropout=0.2,
            bidirectional=True
        )
        self.dropout = nn.Dropout(0.3)
        self.fc1 = nn.Linear(hidden_dim * 2, 32)  # *2 для bidirectional
        self.fc2 = nn.Linear(32, 1)
        self.sigmoid = nn.Sigmoid()
    
    def forward(self, x):
        # x shape: (batch, seq_len)
        embedded = self.embedding(x)           # (batch, seq_len, embedding_dim)
        lstm_out, (hidden, cell) = self.lstm(embedded)  # (batch, seq_len, hidden_dim*2)
        
        # Берем последний временной шаг
        last_output = lstm_out[:, -1, :]       # (batch, hidden_dim*2)
        
        dropped = self.dropout(last_output)
        out = self.fc1(dropped)
        out = torch.relu(out)
        out = self.fc2(out)
        out = self.sigmoid(out)
        
        return out.squeeze()