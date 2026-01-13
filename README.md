# Fake Lumos

Detector de Fake News utilizando Next.js, Tailwind CSS e Google Gemini AI.

## 🚀 Funcionalidades

### Análise de Notícias
- ✅ **Detecção de fake news usando IA do Google Gemini** - Análise avançada com múltiplos indicadores
- ✅ **Análise detalhada** - Score de confiabilidade, classificação e explicações detalhadas
- ✅ **Identificação de elementos** - Separação entre elementos verdadeiros, falsos e suspeitos
- ✅ **Detecção de limitações temporais** - Identifica quando fatos muito recentes podem afetar a análise
- ✅ **Busca em tempo real** (opcional) - Integração com Google Custom Search API para verificação adicional
- ✅ **Validação de entrada** - Sanitização e validação de dados do usuário

### Internacionalização
- ✅ **3 idiomas suportados** - Português (BR), Inglês e Espanhol
- ✅ **Roteamento por idioma** - URLs localizadas (`/pt-BR`, `/en`, `/es`)
- ✅ **Tradução completa** - Todas as interfaces traduzidas

### Acessibilidade
- ✅ **Dark Mode** - Suporte completo a tema claro e escuro
- ✅ **Controle de tamanho de fonte** - Ajuste dinâmico do tamanho do texto
- ✅ **Modo de alto contraste** - Melhor visibilidade para usuários com deficiência visual
- ✅ **Espaçamento de texto** - Ajuste de espaçamento entre linhas e palavras
- ✅ **Destaque de links** - Opção para destacar links visualmente
- ✅ **Fonte para dislexia** - Suporte a fonte OpenDyslexic
- ✅ **Navegação por teclado** - Acessibilidade completa via teclado
- ✅ **ARIA labels** - Atributos de acessibilidade adequados

### Recursos Adicionais
- ✅ **Histórico de verificações** - Armazenamento local das últimas 10 verificações
- ✅ **Seção de dicas** - Guia completo para identificar fake news
- ✅ **Páginas informativas** - Sobre, Como Funciona, Dicas, Termos de Uso, Política de Privacidade
- ✅ **Design responsivo** - Interface adaptável para desktop, tablet e mobile
- ✅ **SEO otimizado** - Metadata, sitemap e structured data
- ✅ **Performance otimizada** - Server Components e otimizações do Next.js

## 📋 Pré-requisitos

- **Node.js 18+** (recomendado: Node.js 20+)
- **npm** ou **yarn**
- **Chave de API do Google Gemini** (obrigatória)
- **Google Custom Search API** (opcional, para busca em tempo real)

## 🛠️ Instalação

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd Fakelumos1
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` e adicione suas chaves de API:

```env
# Obrigatório: Chave da API do Google Gemini
NEXT_PUBLIC_GEMINI_API_KEY=sua_chave_gemini_aqui

# Opcional: Para busca em tempo real no Google
GOOGLE_SEARCH_API_KEY=sua_chave_google_search_aqui
GOOGLE_SEARCH_ENGINE_ID=seu_search_engine_id_aqui
```

#### Como obter as chaves de API:

- **Google Gemini API**: Acesse [Google AI Studio](https://makersuite.google.com/app/apikey) e crie uma nova chave
- **Google Custom Search API** (opcional):
  1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
  2. Crie um projeto ou selecione um existente
  3. Ative a API "Custom Search API"
  4. Crie uma chave de API em "Credenciais"
  5. Configure um Custom Search Engine em [Programmable Search Engine](https://programmablesearchengine.google.com/)

### 4. Execute o servidor de desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

A aplicação estará disponível em:
- Português: [http://localhost:3000/pt-BR](http://localhost:3000/pt-BR)
- Inglês: [http://localhost:3000/en](http://localhost:3000/en)
- Espanhol: [http://localhost:3000/es](http://localhost:3000/es)

## 🏗️ Build para Produção

```bash
# Criar build de produção
npm run build

# Iniciar servidor de produção
npm start
```

## 📁 Estrutura do Projeto

```
Fakelumos1/
├── app/
│   ├── [locale]/              # Páginas com suporte a i18n
│   │   ├── about/             # Página Sobre
│   │   ├── how-it-works/      # Página Como Funciona
│   │   ├── tips/              # Página de Dicas
│   │   ├── privacy/           # Política de Privacidade
│   │   ├── terms/             # Termos de Uso
│   │   ├── layout.tsx         # Layout localizado
│   │   ├── page.tsx           # Página inicial
│   │   └── not-found.tsx      # Página 404
│   ├── api/
│   │   └── verify/
│   │       └── route.ts       # API Route para verificação
│   ├── globals.css            # Estilos globais
│   ├── layout.tsx             # Layout raiz
│   ├── page.tsx               # Redirecionamento
│   └── sitemap.ts             # Geração de sitemap
├── components/
│   ├── accessibility-provider.tsx    # Provider de acessibilidade
│   ├── accessibility-sidebar.tsx     # Sidebar de configurações
│   ├── footer.tsx                    # Rodapé
│   ├── history.tsx                   # Histórico de verificações
│   ├── nav.tsx                       # Navegação
│   ├── news-verifier.tsx             # Componente principal de verificação
│   ├── structured-data.tsx           # Dados estruturados (SEO)
│   ├── theme-provider.tsx            # Provider de tema
│   ├── tips-section.tsx              # Seção de dicas
│   └── verification-result.tsx       # Exibição de resultados
├── i18n/
│   ├── messages/
│   │   ├── pt-BR.json         # Traduções em português
│   │   ├── en.json            # Traduções em inglês
│   │   └── es.json            # Traduções em espanhol
│   ├── request.ts             # Configuração de requisição
│   └── routing.ts             # Configuração de roteamento
├── lib/
│   ├── gemini-analysis.ts     # Lógica principal de análise
│   ├── gemini.ts              # Cliente Gemini (legado)
│   ├── google-search.ts       # Integração com Google Search
│   ├── utils.ts               # Utilitários gerais
│   └── validation.ts          # Validação de entrada
├── public/                    # Arquivos estáticos
│   ├── images/                # Imagens e favicons
│   └── robots.txt             # Configuração de robots
├── middleware.ts              # Middleware para i18n
├── vercel.json                # Configuração do Vercel
└── package.json               # Dependências do projeto
```

## 🌐 Idiomas Suportados

- **Português (Brasil)** - `pt-BR` (padrão)
- **Inglês** - `en`
- **Espanhol** - `es`

A aplicação detecta automaticamente o idioma preferido do navegador ou permite seleção manual.

## 🎨 Tecnologias Utilizadas

### Core
- **Next.js 16.1.1** - Framework React com App Router
- **React 19.0.0** - Biblioteca UI
- **TypeScript 5.7.0** - Tipagem estática

### Estilização
- **Tailwind CSS 3.4.17** - Framework CSS utility-first
- **Lucide React 0.427.0** - Biblioteca de ícones

### Internacionalização
- **next-intl 3.26.5** - Internacionalização para Next.js

### IA e APIs
- **@google/generative-ai 0.21.0** - SDK do Google Gemini

### Utilitários
- **clsx 2.1.1** - Construção de classes CSS
- **tailwind-merge 2.5.0** - Merge de classes Tailwind

## 🔍 Como Funciona

1. **Entrada do Usuário**: O usuário cola ou digita a notícia que deseja verificar
2. **Validação**: O sistema valida e sanitiza o texto de entrada
3. **Análise com IA**: O Google Gemini analisa o conteúdo usando múltiplos critérios:
   - Verificação de fatos conhecidos
   - Análise de linguagem e tom
   - Identificação de padrões de desinformação
   - Detecção de elementos suspeitos
4. **Busca Complementar** (opcional): Se configurado, busca no Google por fontes confiáveis
5. **Resultado**: Retorna uma análise detalhada com:
   - Score de confiabilidade (0-100)
   - Classificação (Verdadeiro, Parcialmente Verdadeiro, Não Verificável, Provavelmente Falso, Comprovadamente Falso)
   - Elementos verdadeiros, falsos e suspeitos
   - Fontes confiáveis (quando disponível)
   - Recomendações e explicações detalhadas

## 🔒 Segurança

- ✅ Sanitização de entrada para prevenir XSS
- ✅ Validação de comprimento de texto (mínimo 10, máximo 5000 caracteres)
- ✅ Rate limiting handling para proteger contra abuso
- ✅ Variáveis de ambiente para chaves de API
- ✅ Validação server-side de todas as requisições

## ♿ Acessibilidade

A aplicação segue as diretrizes WCAG 2.1 e oferece:

- **Contraste**: Modo de alto contraste para melhor visibilidade
- **Tipografia**: Ajuste de tamanho de fonte e espaçamento
- **Navegação**: Suporte completo a navegação por teclado
- **Leitores de tela**: Estrutura semântica e ARIA labels
- **Fonte alternativa**: Suporte a OpenDyslexic para dislexia

## 📱 Responsividade

A aplicação é totalmente responsiva e otimizada para:
- 📱 **Mobile** (320px+)
- 📱 **Tablet** (768px+)
- 💻 **Desktop** (1024px+)
- 🖥️ **Large Desktop** (1440px+)

## 🚀 Deploy

### Vercel (Recomendado)

A aplicação está configurada para deploy na Vercel:

1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente na Vercel:
   - `NEXT_PUBLIC_GEMINI_API_KEY`
   - `GOOGLE_SEARCH_API_KEY` (opcional)
   - `GOOGLE_SEARCH_ENGINE_ID` (opcional)
3. Deploy automático a cada push

### Outras Plataformas

A aplicação pode ser deployada em qualquer plataforma que suporte Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 📊 SEO

A aplicação inclui:
- ✅ Metadata dinâmica por página e idioma
- ✅ Sitemap XML gerado automaticamente
- ✅ Structured Data (JSON-LD)
- ✅ Open Graph tags
- ✅ URLs amigáveis e localizadas
- ✅ robots.txt configurado

## 🧪 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Produção
npm run build        # Cria build de produção
npm start            # Inicia servidor de produção

# Qualidade
npm run lint         # Executa ESLint
```

## 📝 Licença

Este projeto foi desenvolvido como trabalho final na disciplina **'Algoritmo, Política e Sociedade'** da **UFBA** (Universidade Federal da Bahia), sob orientação do **Prof. Dr. Paulo Fonseca**.

## 👥 Equipe

- **Luís Teixeira** - Full-Stack Developer e Estudante
- **Prof. Dr. Paulo Fonseca** - Orientador do Projeto

## 📧 Contato

- **Email**: luishg213@outlook.com
- **Telefone**: +55 (71) 9 9332-2305

## 🌟 Contribuições

Este é um projeto acadêmico, mas sugestões e melhorias são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## ⚠️ Avisos Importantes

1. **Limitações da IA**: A análise é baseada em modelos de IA e pode não ser 100% precisa. Sempre verifique informações críticas através de múltiplas fontes confiáveis.

2. **Rate Limiting**: A API do Google Gemini possui limites de quota. Se você exceder o limite, aguarde alguns minutos antes de tentar novamente.

3. **Notícias Recentes**: Fatos muito recentes (últimas semanas/meses) podem não ser verificáveis devido à falta de fontes confiáveis disponíveis.

4. **Uso Educacional**: Esta ferramenta é destinada a fins educacionais e de conscientização. Não substitui a verificação profissional de fatos.

---

**Fake Lumos** - Combatendo a desinformação com tecnologia e educação. 🚀
