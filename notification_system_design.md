# For backend task

## question: Finding Top 'n' Notifications

To solve this, I need to check two things for each notification: the weight (priority) and the time it was received (recency)
as seen ine the followqing

- **Weight**: Based on the rules, Placement gets the highest priority (weight 3), Result gets weight 2, and Event gets weight 1.
- **Recency**: If two notifications have the exact same weight, I check their Timestamp and put the newer one first.

In my code, I will fetch the data from the API and use the javascript `sort()` function to sort the array based on these two rules. Then I use `slice(0, n)` to return only the top 'n' items that the user wants, so thats done with

### Maintaining Top 10 Efficiently,
Right now, what happens is that code sorts the whole list of notifications which works fine for fetching data once. But the problem says new notifications will keep coming in. 

If new notifications are coming in continuously, sorting the whole array every time would be too slow, which is why I'm doing like this.

To maintain the top 10 efficiently, we should use a **Min-Heap** data structure (Priority Queue) with a fixed size of 'n' (like 10). 
- We keep a heap of the top 10 elements.
- The root of the Min-Heap will be the notification with the lowest priority among those top 10.
- When a new notification comes in, ill chcek if the priority is higherr than root. If it is, will remove root and insert the new one. 

This way, not evrything has tro be sorted. just doing a small comparison which takes O(log n) time, making it very fast and efficient. So I suppose that's how it goes.
