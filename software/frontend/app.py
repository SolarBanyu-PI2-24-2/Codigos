import streamlit as st

pages = {
    "": [
        st.Page("pages/login.py", title="Login"),
        st.Page("pages/home.py", title="Home"),
        st.Page("pages/dashboard.py", title="Monitoramento"),
        st.Page("pages/report.py", title="Relatório"),
        st.Page("pages/alert.py", title="Alertas"),
    ],
    "Suporte": [
        st.Page("pages/faq.py", title="FAQ's"),
        st.Page("pages/tutorials.py", title="Tutoriais"),
        st.Page("pages/general_info.py", title="Informações gerais"),
        st.Page("pages/solarbanyu.py", title="SolarBanyu"),
        st.Page("pages/config.py", title="Configurações"),
    ]
}

pg = st.navigation(pages)
pg.run()