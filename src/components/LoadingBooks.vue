<template>
	<div class="bookshelf_wrapper">
		<ul class="books_list">
			<li class="book_item first"></li>
			<li class="book_item second"></li>
			<li class="book_item third"></li>
			<li class="book_item fourth"></li>
			<li class="book_item fifth"></li>
			<li class="book_item sixth"></li>
		</ul>
		<div class="shelf"></div>
		<slot></slot>
	</div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
$thickness: 5px;
$duration: 2500;
$delay: $duration / 6;
$color: var(--darkGrey);

@mixin polka($size, $dot, $base, $accent) {
	background: $base;
	background-image: radial-gradient($accent $dot, transparent 0);
	background-position: 0 -2.5px;
	background-size: $size $size;
}

body {
	width: 100%;
	height: 100vh;
	margin: 0;
	background-color: white;
}

.bookshelf_wrapper {
	padding-top: 150px;
}

.books_list {
	position: relative;
	width: 300px;
	padding: 0;
	margin: 0 auto;
	transform: scaleX(-1);
}

.book_item {
	position: absolute;
	top: -120px;
	box-sizing: border-box;
	width: 40px;
	height: 120px;
	list-style: none;
	background-color: white;
	border: $thickness solid $color;
	opacity: 0;
	transform: translateX(300px);
	transform-origin: bottom left;
	animation: travel #{$duration}ms linear infinite;

	&.first {
		top: -140px;
		height: 140px;

		&::before,
		&::after {
			position: absolute;
			top: 10px;
			left: 0;
			width: 100%;
			height: $thickness;
			content: "";
			background-color: $color;
		}

		&::after {
			top: initial;
			bottom: 10px;
		}
	}

	&.second,
	&.fifth {
		&::before,
		&::after {
			position: absolute;
			top: 10px;
			left: 0;
			box-sizing: border-box;
			width: 100%;
			height: $thickness * 3.5;
			content: "";
			border-top: $thickness solid $color;
			border-bottom: $thickness solid $color;
		}

		&::after {
			top: initial;
			bottom: 10px;
		}
	}

	&.third {
		&::before,
		&::after {
			position: absolute;
			top: 10px;
			left: 9px;
			box-sizing: border-box;
			width: 12px;
			height: 12px;
			content: "";
			border: $thickness solid $color;
			border-radius: 50%;
		}

		&::after {
			top: initial;
			bottom: 10px;
		}
	}

	&.fourth {
		top: -130px;
		height: 130px;

		&::before {
			position: absolute;
			top: 46px;
			left: 0;
			box-sizing: border-box;
			width: 100%;
			height: $thickness * 3.5;
			content: "";
			border-top: $thickness solid $color;
			border-bottom: $thickness solid $color;
		}
	}

	&.fifth {
		top: -100px;
		height: 100px;
	}

	&.sixth {
		top: -140px;
		height: 140px;

		&::before {
			position: absolute;
			bottom: 31px;
			left: 0;
			box-sizing: border-box;
			width: 100%;
			height: $thickness;
			content: "";
			background-color: $color;
		}

		&::after {
			position: absolute;
			bottom: 10px;
			left: 9px;
			box-sizing: border-box;
			width: 12px;
			height: 12px;
			content: "";
			border: $thickness solid $color;
			border-radius: 50%;
		}
	}

	&:nth-child(2) {
		animation-delay: #{$delay * 1}ms;
	}

	&:nth-child(3) {
		animation-delay: #{$delay * 2}ms;
	}

	&:nth-child(4) {
		animation-delay: #{$delay * 3}ms;
	}

	&:nth-child(5) {
		animation-delay: #{$delay * 4}ms;
	}

	&:nth-child(6) {
		animation-delay: #{$delay * 5}ms;
	}
}

.shelf {
	position: relative;
	width: 300px;
	height: $thickness;
	margin: 0 auto;
	background-color: $color;
}

@keyframes move {
	from {
		background-position-x: 0;
	}

	to {
		background-position-x: 10px;
	}
}

@keyframes travel {
	0% {
		opacity: 0;
		transform: translateX(300px) rotateZ(0deg) scaleY(1);
	}

	6.5% {
		transform: translateX(279.5px) rotateZ(0deg) scaleY(1.1);
	}

	8.8% {
		transform: translateX(273.6px) rotateZ(0deg) scaleY(1);
	}

	10% {
		opacity: 1;
		transform: translateX(270px) rotateZ(0deg);
	}

	17.6% {
		transform: translateX(247.2px) rotateZ(-30deg);
	}

	45% {
		transform: translateX(165px) rotateZ(-30deg);
	}

	49.5% {
		transform: translateX(151.5px) rotateZ(-45deg);
	}

	61.5% {
		transform: translateX(115.5px) rotateZ(-45deg);
	}

	67% {
		transform: translateX(99px) rotateZ(-60deg);
	}

	76% {
		transform: translateX(72px) rotateZ(-60deg);
	}

	83.5% {
		opacity: 1;
		transform: translateX(49.5px) rotateZ(-90deg);
	}

	90% {
		opacity: 0;
	}

	100% {
		opacity: 0;
		transform: translateX(0) rotateZ(-90deg);
	}
}
</style>
