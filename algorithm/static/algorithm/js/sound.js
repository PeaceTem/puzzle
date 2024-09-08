
class SoundButton {
    constructor(buttonClass, soundFile) {
        this.buttons = document.getElementsByClassName(buttonClass);
        this.sound = new Audio(soundFile);

        Array.from(this.buttons).forEach(button => {
            button.addEventListener('click', () => {
                this.playSound();
            });
        });
    }

    playSound() {
        this.sound.play();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const soundButton = new SoundButton('soundButton', '/static/algorithm/media/click.mp3');
});
// fix the issue of playing sound after the content of a