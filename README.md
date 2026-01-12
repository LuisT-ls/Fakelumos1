# Fake Lumos

Detector de Fake News utilizando Next.js, Tailwind CSS e Google Gemini AI.

## 🚀 Funcionalidades

- ✅ Detecção de fake news usando IA do Google Gemini
- ✅ Internacionalização (Português BR, Inglês, Espanhol)
- ✅ Dark Mode
- ✅ Recursos de Acessibilidade (tamanho de fonte, alto contraste)
- ✅ Histórico das últimas 10 verificações
- ✅ Seção de dicas para identificar fake news
- ✅ Design responsivo e moderno

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Chave de API do Google Gemini

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd Fakelumos1
```

2. Instale as dependências:
```bash
npm install
```

3. Configure a variável de ambiente:
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` e adicione sua chave da API do Gemini:
```
NEXT_PUBLIC_GEMINI_API_KEY=sua_chave_aqui
```

Para obter uma chave da API do Gemini, acesse: https://makersuite.google.com/app/apikey

4. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📁 Estrutura do Projeto

```
Fakelumos1/
├── app/
│   ├── [locale]/          # Páginas com suporte a i18n
│   ├── api/               # API Routes
│   ├── globals.css        # Estilos globais
│   └── layout.tsx         # Layout raiz
├── components/            # Componentes React
├── i18n/                  # Configuração de internacionalização
├── lib/                   # Utilitários e serviços
└── public/                # Arquivos estáticos
```

## 🌐 Idiomas Suportados

- Português (Brasil) - `pt-BR`
- Inglês - `en`
- Espanhol - `es`

## 🎨 Tecnologias Utilizadas

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **next-intl** - Internacionalização
- **Google Gemini AI** - Análise de fake news
- **Lucide React** - Ícones

## 📝 Licença

Este projeto foi desenvolvido como trabalho final na disciplina 'Algoritmo, Política e Sociedade' da UFBA.

## 👤 Contato

- Email: luishg213@outlook.com
- Telefone: +55 (71) 9 9332-2305