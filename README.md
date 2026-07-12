# SGCL Site Limpo — versão PNG

Este pacote foi gerado para substituir a versão problemática com CSS injetado por JavaScript.

## Importante

Este pacote referencia somente arquivos PNG oficiais:

- `assets/logo-sgcl.png`
- `assets/hero-loterica.png`
- `assets/fundo-tecnologico.png`

Copie os PNGs oficiais para a pasta `assets/`.

Não há referência a `.svg` no HTML/CSS.

## Estrutura

```text
site-sgcl-limpo-png/
  index.html
  acesso-aplicativos.html
  css/styles.css
  js/main.js
  assets/
    COLOQUE_AQUI_logo-sgcl.png
    COLOQUE_AQUI_hero-loterica.png
    COLOQUE_AQUI_fundo-tecnologico.png
```

## Decisões

- Menu simples, sem dropdown.
- Botão amarelo "Solicitar demonstração" separado.
- Rodapé mantido no padrão aprovado.
- Card "Sobre nós" fica direto no HTML/CSS.
- JavaScript não injeta CSS.
- JavaScript não reescreve rodapé.
- JavaScript não altera o card.

## Teste local

```powershell
cd site-sgcl-limpo-png
python -m http.server 8080
```

Abra:

```text
http://localhost:8080/?v=png
```
