# ml_analyzer/preprocess.py
import torch
from torch.utils.data import Dataset, DataLoader
import numpy as np

class PayloadDataset(Dataset):
    """Датасет для XSS/SQLi полезных нагрузок"""
    def __init__(self, payloads, labels, tokenizer, max_len=200):
        self.payloads = payloads
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_len = max_len
    
    def __len__(self):
        return len(self.payloads)
    
    def __getitem__(self, idx):
        text = self.payloads[idx]
        label = self.labels[idx]
        
        # Токенизация (Word-level или Char-level)
        tokens = self.tokenizer.encode(text, max_length=self.max_len, truncation=True)
        
        return torch.tensor(tokens, dtype=torch.long), torch.tensor(label, dtype=torch.float32)

# Стандартные токены для паддинга и неизвестных слов
PAD_TOKEN = 0
UNK_TOKEN = 1