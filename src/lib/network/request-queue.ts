type Task<T> = () => Promise<T>;

class Queue {
  private readonly tasks: Task<any>[] = [];
  private isProcessing = false;

  addTask<T>(task: Task<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.tasks.push(async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      if (!this.isProcessing) {
        this.processNext();
      }
    });
  }

  private async processNext(): Promise<void> {
    if (this.tasks.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const task = this.tasks.shift();

    if (task) {
      try {
        await task();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Task failed:", error);
      } finally {
        this.processNext();
      }
    }
  }
}

export const requestQueue = new Queue();
