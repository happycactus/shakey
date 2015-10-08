<?php
    //SAVES JSON HIGHSCORES
	$myFile = "hangman_player_statistics.json";
    $fh = fopen($myFile, 'w+') or die("Can't open file");
    $stringData = $_POST;
    fwrite($fh, json_encode($stringData));
    fclose($fh);
?>