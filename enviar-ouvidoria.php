<?php
// enviar-ouvidoria.php

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo 'Método não permitido';
  exit;
}

// 1) Recebe e valida
$nome     = trim($_POST['Nome']    ?? '');
$email    = filter_var($_POST['Email'] ?? '', FILTER_VALIDATE_EMAIL);
$modo     = $_POST['Modo'] ?? 'Normal';
$contato  = trim($_POST['Contato'] ?? '');
$endereco = trim($_POST['Endereço'] ?? '');
$tipo     = trim($_POST['Tipo']    ?? '');
$assunto  = trim($_POST['Assunto'] ?? '');
$descricao= trim($_POST['Descrição'] ?? '');

if (!$nome || !$email || !$tipo || !$assunto || !$descricao) {
  http_response_code(400);
  echo 'Por favor, preencha todos os campos obrigatórios.';
  exit;
}

// 2) Monta mensagem
$to      = 'ouvidoria@ipresal.pe.gov.br';
$subject = "[$tipo] $assunto — $nome";
$body    = "Modo: $modo\nNome: $nome\nEmail: $email\nContato: $contato\nEndereço: $endereco\n\nDescrição:\n$descricao\n";

// 3) Cabeçalhos
$headers  = "From: no-reply@seudominio.com\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/".phpversion();

// 4) Envia
if (mail($to, $subject, $body, $headers)) {
  echo 'Obrigado! Sua manifestação foi enviada com sucesso.';
} else {
  http_response_code(500);
  echo 'Erro ao enviar. Por favor, tente novamente mais tarde.';
}
