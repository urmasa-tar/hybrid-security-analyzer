import React from 'react';
import { FaShieldAlt, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const SecurityCard = ({ payload, result }) => {
    return (
        <div className="card" style={{
            borderLeft: `4px solid ${result.is_vulnerable ? '#dc3545' : '#28a745'}`,
            marginBottom: '15px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h4>Payload:</h4>
                    <code style={{
                        background: '#f4f4f4',
                        padding: '8px',
                        display: 'block',
                        borderRadius: '4px',
                        marginTop: '5px',
                        wordBreak: 'break-all'
                    }}>{payload}</code>
                </div>
                <div>
                    {result.is_vulnerable ? (
                        <FaExclamationTriangle size={30} color="#dc3545" />
                    ) : (
                        <FaCheckCircle size={30} color="#28a745" />
                    )}
                </div>
            </div>
            
            <div className="mt-20">
                <p><strong>ML Confidence:</strong> {(result.ml_confidence * 100).toFixed(2)}%</p>
                <p><strong>Risk Level:</strong> 
                    <span style={{
                        background: result.risk_level === 'HIGH' ? '#dc3545' : '#28a745',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        marginLeft: '8px'
                    }}>{result.risk_level}</span>
                </p>
                
                {result.sast_findings.length > 0 && (
                    <div>
                        <p><strong>SAST Findings:</strong></p>
                        <ul>
                            {result.sast_findings.map((finding, idx) => (
                                <li key={idx}>{finding.type}: {finding.pattern}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SecurityCard;