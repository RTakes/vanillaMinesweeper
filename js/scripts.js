
document.addEventListener('DOMContentLoaded', function() {
	var game = new VanillaMinesweeper({
		tag  : 'board'

	});




	var reset = document.getElementById('reset');
	reset.addEventListener('click', function(e) {
		game.newGame();
	});



});