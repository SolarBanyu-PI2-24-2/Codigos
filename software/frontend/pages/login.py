import streamlit as st

st.set_page_config(layout="wide",)

# CSS personalizado
css = """
<style>
    .container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: white;
    }
    .left {
        width: 50%;
        display: flex;
        height: 100vh;
        justify-content: center;
        align-items: center;
        background-color: #E1E8FF;
    }
    .right {
        width: 50%; /* Metade da largura da tela */
        height: 10vh; /* Altura total da tela */
        display: flex;
        justify-content: center; /* Centraliza o conteúdo horizontalmente */
        align-items: center; /* Centraliza o conteúdo verticalmente */
        background-color: #fffff; /* Ajuste caso necessário */
}

    .square {
            width: 100%; /* Proporção dentro do .right */
            height: 100%; /* Proporção dentro do .right */
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 3rem; /* Espaçamento interno */
}
    .logo {
        max-width: 10%;
    }
    .form-group {       
        width: 500px; /* Define largura para os inputs */
        margin-bottom: 10px; /* Espaço entre os campos */
}

    label {
        display: block;
        margin-bottom: 5px;
        font-size: 1rem;
        color: #323232;
}

    .form-input {
        width: 100%;
        padding: 10px;
        border: 1px solid #f0f4ff;
        border-radius: 8px;
        background-color: rgba(176, 186, 195, 0.4);
        font-size: 1rem;
        font-colour: black;
        margin-bottom: 30px; 
}
    .button {
        background-color: #FCEFA6;
        color: #323232;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 20px;
        width: 250px;
        margin: 0 auto; /* Centraliza o botão */
        display: block; /* Garante que o botão seja tratado como um bloco */
        text-align: center; /* Alinha o texto dentro do botão */
    }
    .button:hover {
        background-color: #F2CD00;
    }
    .right .small-text {
        font-size: 16px;
        color: #7C838A;
        text-align: center;
        margin-top: 20px; /* Dá um espaço acima do texto pequeno */
        margin-bottom: 10px; /* Adiciona espaçamento abaixo do título */
    }
    .small-text-footer {
        font-size: 16px;
        color: #7C838A;
        position: absolute; /* Define a posição absoluta */
        bottom: 10px; /* Fixa na parte inferior */
        width: 100%; /* Faz com que o texto ocupe toda a largura do container */
        text-align: center; /* Centraliza o texto */
    }
    .right .titulo {        
        color: #323232;
        text-align: center;
        font-size: 20; /* Ajusta o tamanho do título */
        margin-bottom: 30px; /* Adiciona espaçamento abaixo do título */
    }
    .right .forgot-link {
        font-size: 10;
        color: #555;
        text-align: center;
        margin-top: -20px;
        margin-bottom: 30px;
        text-decoration: underline;
        display: flex;
    }
    .forgot-link:hover {
        text-decoration: underline;
        color: #000;
    }
</style>
"""

# Adicionando o CSS na página
st.markdown(css, unsafe_allow_html=True)

# Criando o layout
st.markdown(
    """
    <div class="container">
        <!-- Coluna Esquerda -->
        <div class="left">
            <img src="https://gitlab.com/unb-esw/fga-pi2/semestre-2024-3/squad04/documentacao-relatorio/-/raw/main/docs/assets/software/identidadeVisual/logoClaraSemBg.png?ref_type=heads" alt="Logo Solar Banyu" class="logo">
        </div>
        <!-- Coluna Direita -->
        <div class="right">
            <div class="square">
                <h2 class="titulo">Bem-vindo ao SolarBanyu</h2>
                <form action="/" method="post">
                    <div class="form-group">
                        <label for="usuario">Usuário</label>
                        <input class="form-input" type="text" id="usuario" name="usuario">
                    </div>
                    <div class="form-group">
                        <label for="senha">Senha</label>
                        <input class="form-input" type="password" id="senha" name="senha">
                    </div>
                    <a href="#" class="forgot-link">Esqueci meus dados</a>
                    <button class="button" type="submit">Acessar</button>
                </form>
                <p class="small-text">
                    Seus dados estão seguros. Utilizamos tecnologia de criptografia.
                </p>   
                <p class="small-text-footer">
                    Squad 4 - FCTE: PI2
                </p>
            </div>
        </div>
    </div>
    """,
    unsafe_allow_html=True
)
