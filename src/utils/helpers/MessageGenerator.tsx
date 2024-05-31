export function MessageGenerator(value: number): string {
  console.log(value);
  if (value >= 90) {
    return "Impressive! Your knowledge of geography beats the masses!";
  } else if (70 < value && value < 90) {
    return "Great job! You have a solid understanding of geography.";
  } else if (50 < value && value < 70) {
    return "Not bad! You have a decent knowledge of geography.";
  } else if (30 < value && value < 50) {
    return "You might want to brush up on your geography skills.";
  } else {
    return "It seems like you have some catching up to do in geography.";
  }
}
