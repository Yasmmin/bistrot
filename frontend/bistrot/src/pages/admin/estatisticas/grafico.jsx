import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './estatistica.css';

const LineChartComponent = () => {
    const [filter, setFilter] = useState('daily');
    const [chartData, setChartData] = useState([]);
    const [maxValue, setMaxValue] = useState(0);

    const fetchData = async (selectedFilter) => {
        try {
            const response = await axios.get(`http://localhost:6969/faturamento`, {
                params: { period: selectedFilter }
            });

            setChartData(response.data);
        } catch (error) {
            console.error("Erro ao buscar dados de faturamento", error);
        }
    };
    useEffect(() => {
        // Definindo "Semanal" como o filtro padrão ao montar a página
        setFilter('weekly');
    }, []);
    

    useEffect(() => {
        fetchData(filter);
    }, [filter]);

    useEffect(() => {
        const max = Math.max(...chartData.map(item => item.valor_total));
        setMaxValue(max + 3);
    }, [chartData]);

    const handleFilterChange = (e) => {
        const selectedFilter = e.target.value;
        setFilter(selectedFilter);
    };

    return (
        <div className="chart-container">
            <div className="chart-header d-flex justify-content-between align-items-center">
                <h3>Faturamento - Finalizados</h3>
                <div className="filter-dropdown me-4">
                    <select value={filter} onChange={handleFilterChange}>
                        <option value="weekly">Semanal</option>
                        <option value="monthly">Mensal</option>
                        <option value="yearly">Anual</option>
                    </select>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" style={{ fontSize: '10pt' }} />
                    <YAxis domain={[0, maxValue]} tickFormatter={(value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />

                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="valor_total" stroke="#8884d8" activeDot={{ r: 8 }}
                        formatter={(value) => parseFloat(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LineChartComponent;
