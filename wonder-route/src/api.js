// This is a mock function. In a real application, you would make a
// fetch() call to your backend server, which then calls the LLM.
export const mockApiCall = (payload) => {
  console.log("Sending data to LLM:", payload);

  // Destructure payload for easy use in the template string
  const { friends, visits, preferences } = payload;
  const friendNames = friends.map(f => f.name).join(', ') || 'your friends';
  const visitNames = visits.map(v => v.name).join(', ') || 'the recommended areas';
  const { startTime, endTime, budget, food, coffee } = preferences;

  // Simulate network delay
  return new Promise(resolve => {
    setTimeout(() => {
      const response = `
Here is your personalized itinerary!

**Meetup Time:** ${startTime} - ${endTime}
**Budget:** ${budget}

**Plan:**

1.  **${startTime} - Meet & Greet:** Everyone should meet up at a central location. A good starting point might be near ${friends[0]?.name || 'the first friend\'s location'}.

2.  **Coffee Stop:** Since you wanted coffee, let's grab a cup at a highly-rated cafe near ${visits[0]?.name || 'your first destination'}. This will be a great way to kick things off.

3.  **Main Activity:** Head over to explore ${visitNames}. Given your ${budget} budget, you can enjoy the sights and maybe find some cheap street food if you're getting hungry.

4.  **Lunch/Dinner:** ${food ? `Around lunchtime, you should find a great ${budget}-friendly restaurant. I'd recommend looking for something authentic in the ${visits[visits.length - 1]?.name || 'area you are visiting'}.` : 'You can grab a quick snack while you explore.'}

5.  **Wrap-up:** As ${endTime} approaches, you can start heading back. It was great planning your day with ${friendNames}!

Enjoy your trip!
      `;
      resolve(response);
    }, 2000); // 2-second delay
  });
};
