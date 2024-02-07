

CREATE TABLE `cliente` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `senha` varchar(290) NOT NULL,
  `role` varchar(20) NOT NULL,
  `foto` varchar(250) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `pedido` (
  `id` int(11) NOT NULL,
  `hora_pedido` int(11) NOT NULL,
  `valor_total` int(11) NOT NULL,
  `data` int(11) NOT NULL,
  `hora_entrega` int(11) NOT NULL,
  `hora_prevista` int(11) NOT NULL,
  `obs` int(11) NOT NULL,
  `cliente` int(11) NOT NULL,
  `produto` int(11) NUlL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `produto` (
  `id` int(11) NOT NULL,
  `nome` varchar(150) DEFAULT NULL,
  `descricao` varchar(150) NOT NULL,
  `preco` double DEFAULT NULL,
  `tamanho` varchar(50) NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `restricaoalergica` varchar(50) NOT NULL,
  `foto` varchar(250) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `cliente`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `pedido`
  ADD KEY `fk_produto` (`produto`),
  ADD KEY `fk_cliente` (`cliente`);

ALTER TABLE `produto`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `cliente`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `produto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `pedido`
  ADD CONSTRAINT `fk_cliente` FOREIGN KEY (`cliente`) REFERENCES `cliente` (`id`),
  ADD CONSTRAINT `fk_produto` FOREIGN KEY (`produto`) REFERENCES `produto` (`id`);
COMMIT;

