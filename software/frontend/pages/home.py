import streamlit as st

st.set_page_config(layout="wide",)

# Simulação de dados
dados = {
    "nome": "Francisca Silva",
    "dias_com_solarbanyu": 97,
    "agua_dessalinizada": "25.000 L",
    "energia_economizada": "250 kWh",
    "proxima_troca_filtro": "28/12/2026",
    "alertas": [
        {"id": "00007", "nome": "Vazamento detectado", "data": "25/11/2024", "prioridade": "Urgente"},
        {"id": "00006", "nome": "Tudo funcionando normal", "data": "21/10/2024", "prioridade": "Rotina"},
        {"id": "00005", "nome": "Troca de filtro recomendada", "data": "10/10/2024", "prioridade": "Média"},
        {"id": "00004", "nome": "Bateria sem energia", "data": "01/10/2024", "prioridade": "Baixa"},
        {"id": "00003", "nome": "Tanque de água cheio", "data": "23/09/2024", "prioridade": "Baixa"},
        {"id": "00002", "nome": "Atualização necessária", "data": "15/09/2024", "prioridade": "Média"},
        {"id": "00001", "nome": "Tudo funcionando normal", "data": "20/08/2024", "prioridade": "Rotina"},
    ],
    "unidade": {
        "endereco": "Rua das Águas Claras, 123, Bairro Sustentável",
        "estado": "Ceará, Brasil",
        "data_instalacao": "20/08/2024",
        "numero_serie": "SBY-2024-001234",
        "modelo_sistema": "SolarBanyu Plus 3000",
        "capacidade": "20 L/Dia",
    },
}

st.title(f"Seja bem-vinda, {dados['nome']}")
st.subheader("Aqui você acompanha a produção de água doce.")

# Indicadores
col1, col2 = st.columns(2)

with col1:
    subcol1, subcol2 = st.columns(2)
    with subcol1:
        st.metric("Dias com SolarBanyu", dados["dias_com_solarbanyu"])
    with subcol2:
        st.metric("Água dessalinizada", dados["agua_dessalinizada"])
    st.subheader("Alertas")
    st.table(dados["alertas"])
with col2:
    subcol1, subcol2 = st.columns(2)
    with subcol1:
        st.metric("Energia economizada", dados["energia_economizada"])
    with subcol2:
        st.metric("Próxima troca de filtro", dados["proxima_troca_filtro"])

    st.subheader(f"SolarBanyu da {dados['nome']}")
    st.markdown(f"""
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Endereço de instalação</td>
            <td style="padding: 8px; border: 1px solid #ddd;">{dados['unidade']['endereco']}</td>
        </tr>
        <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Estado</td>
            <td style="padding: 8px; border: 1px solid #ddd;">{dados['unidade']['estado']}</td>
        </tr>
        <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Data de instalação</td>
            <td style="padding: 8px; border: 1px solid #ddd;">{dados['unidade']['data_instalacao']}</td>
        </tr>
        <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Número de série</td>
            <td style="padding: 8px; border: 1px solid #ddd;">{dados['unidade']['numero_serie']}</td>
        </tr>
        <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Modelo do sistema</td>
            <td style="padding: 8px; border: 1px solid #ddd;">{dados['unidade']['modelo_sistema']}</td>
        </tr>
        <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Capacidade</td>
            <td style="padding: 8px; border: 1px solid #ddd;">{dados['unidade']['capacidade']}</td>
        </tr>
    </table>
    """, unsafe_allow_html=True)
