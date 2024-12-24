/* For typescript compiler to access new startViewTransition method on Document */
interface Document {
	startViewTransition(callback: () => void): void;
}
