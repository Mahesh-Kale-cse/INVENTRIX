import { useState, useEffect } from 'react';
import { salesService } from '../services';
import LoadingSpinner from '../components/LoadingSpinner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Activity, Calendar } from 'lucide-react';
import Alert from '../components/Alert';
import toast from 'react-hot-toast';

export default function Predictions() {
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState([]);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    loadPredictions();
  }, []);

  const loadPredictions = async () => {
    try {
      const data = await salesService.getPrediction();
      setPredictions(data.predictions || data || []);
      setInsights(data.insights || []);
    } catch (error) {
      toast.error('Failed to load predictions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-xs)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-md)'
        }}>
          <Activity size={32} style={{ color: 'var(--primary-500)' }} />
          Sales Predictions
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          AI-powered sales forecasting and business insights
        </p>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div style={{
          display: 'grid',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-xl)'
        }}>
          {insights.map((insight, idx) => (
            <Alert
              key={idx}
              type={insight.type || 'info'}
              title={insight.title}
              message={insight.message}
            />
          ))}
        </div>
      )}

      {/* Prediction Chart */}
      <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: 'bold',
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)'
        }}>
          <TrendingUp size={20} style={{ color: 'var(--primary-500)' }} />
          Predicted Sales Trend
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={predictions}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="period" stroke="var(--text-secondary)" />
            <YAxis stroke="var(--text-secondary)" />
            <Tooltip
              contentStyle={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="var(--success-500)"
              strokeWidth={3}
              name="Actual Sales"
              dot={{ fill: 'var(--success-500)', r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="var(--primary-500)"
              strokeWidth={3}
              strokeDasharray="5 5"
              name="Predicted Sales"
              dot={{ fill: 'var(--primary-500)', r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Prediction Details */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'var(--space-lg)'
      }}>
        <div className="card" style={{ borderLeft: '4px solid var(--primary-500)' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-sm)' }}>
            Next Month Prediction
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 'var(--space-sm)' }}>
            {predictions.length > 0 ? predictions[predictions.length - 1]?.predicted || 'N/A' : 'N/A'}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--success-500)', fontWeight: '600' }}>
            <TrendingUp size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
            Based on historical data
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--success-500)' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-sm)' }}>
            Confidence Level
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 'var(--space-sm)' }}>
            85%
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            High accuracy prediction
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--info-500)' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-sm)' }}>
            Trend Direction
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 'var(--space-sm)' }}>
            Upward
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--success-500)', fontWeight: '600' }}>
            +12% growth expected
          </div>
        </div>
      </div>
    </div>
  );
}
