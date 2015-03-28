
document.addEventListener('DOMContentLoaded', function() {
	var game = new VanillaMinsweeper({
		tag  : 'board'

	});




	var reset = document.getElementById('reset');
	reset.addEventListener('click', function(e) {
		game.newGame();
	});



});