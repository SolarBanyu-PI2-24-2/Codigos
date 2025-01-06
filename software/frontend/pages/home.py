import streamlit as st

st.set_page_config(layout="wide")

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
col1, col2, col3, col4 = st.columns(4)
with col1:
    st.metric("Dias com SolarBanyu", dados["dias_com_solarbanyu"])
with col2:
    st.metric("Água dessalinizada", dados["agua_dessalinizada"])
with col3:
    st.metric("Energia economizada", dados["energia_economizada"])
with col4:
    st.metric("Próxima troca de filtro", dados["proxima_troca_filtro"])

st.subheader("Alertas")
st.table(dados["alertas"])

# st.subheader(f"SolarBanyu da {dados['nome']}")
# st.write(f"""
# - **Endereço de instalação:** {dados['unidade']['endereco']}
# - **Estado:** {dados['unidade']['estado']}
# - **Data de instalação:** {dados['unidade']['data_instalacao']}
# - **Número de série:** {dados['unidade']['numero_serie']}
# - **Modelo do sistema:** {dados['unidade']['modelo_sistema']}
# - **Capacidade:** {dados['unidade']['capacidade']}
# """)

# col5, col6 = st.columns(2)
# with col5:
#     st.button("Pedir suporte")
# with col6:
#     st.button("Adicionar nova unidade")
