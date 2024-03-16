

function Carrinho() {
  const carrinhoProdutos = JSON.parse(localStorage.getItem("carrinhoProdutos")) || [];

  return (
    <div>
      <h1 className="text-center">Carrinho</h1>
      <div>
        {carrinhoProdutos.map((produto, index) => (
          <div key={index}>
            <h2>{produto.produto.nome}</h2>
            <p>Quantidade: {produto.quantidade}</p>
            <p>Preço Total: {produto.precoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Carrinho;
