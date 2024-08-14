from random import randrange

number = randrange(0, 10)
guess = -1

while guess != number:
    print('guess a number')
    guess = int(input())

    if guess > number:
        print("you're too high, go lower")
    elif guess < number:
        print("you're too low, go up")
    else:
        print('omg ur so smart')
