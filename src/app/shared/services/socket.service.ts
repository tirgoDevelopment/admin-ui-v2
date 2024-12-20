import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { env } from 'src/environmens/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private readonly sseUrl = env.apiUrl +'/users/sse/events';
  private eventSource: EventSource | null = null;
  private sseSubject = new Subject<any>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: any = null;

  constructor() {}

  connectToSSE(token: string) {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    this.disconnectSSE();
    try {
      this.eventSource = new EventSource(`${this.sseUrl}?token=${token}`, {
        withCredentials: true
      });

      this.eventSource.onopen = () => {
        console.log('SSE connection opened successfully');
        this.reconnectAttempts = 0;
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.sseSubject.next(data);
        } catch (error) {
          console.error('Error parsing SSE data:', error);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        if (this.eventSource?.readyState === EventSource.CONNECTING) {
          console.log('Connection is in pending state, attempting to reconnect...');
        }

        this.eventSource?.close();
        this.eventSource = null;

        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          const backoffTime = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
          
          console.log(`Attempting to reconnect in ${backoffTime}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
          
          this.reconnectTimeout = setTimeout(() => {
            this.connectToSSE(token);
          }, backoffTime);
        } else {
          console.error('Max reconnection attempts reached');
          this.sseSubject.error('Max reconnection attempts reached');
        }
      };
    } catch (error) {
      console.error('Error creating EventSource:', error);
      this.sseSubject.error(error);
    }
  }

  getSSEEvents(): Observable<any> {
    return this.sseSubject.asObservable();
  }

  disconnectSSE() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    
    this.reconnectAttempts = 0;
  }
}
