import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModules } from '../../modules/common.module';

interface ChatMessage {
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: true,
  imports: [CommonModules]
})
export class ChatComponent {
  @ViewChild("scrollContainer") private scrollContainer!: ElementRef;

  messages: ChatMessage[] = [];
  newMessage: string = "";
  isTyping: boolean = false;
  showQuickReplies: boolean = true;
  quickReplies: string[] = [
    "Track my order",
    "Return policy",
    "Payment issues",
    "Contact support"
  ];

  ngOnInit() {
    this.addBotMessage("Hello! How can I assist you today?");
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({
        text: this.newMessage,
        sender: "user",
        timestamp: new Date()
      });

      this.simulateBotResponse(this.newMessage);
      this.newMessage = "";
      this.showQuickReplies = false;
    }
  }

  sendQuickReply(reply: string) {
    this.newMessage = reply;
    this.sendMessage();
  }

  private simulateBotResponse(userMessage: string) {
    this.isTyping = true;

    setTimeout(() => {
      this.isTyping = false;
      const response = this.generateBotResponse(userMessage);
      this.addBotMessage(response);
      this.showQuickReplies = true;
    }, 1500);
  }

  private addBotMessage(text: string) {
    this.messages.push({
      text,
      sender: "bot",
      timestamp: new Date()
    });
  }

  private generateBotResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes("track")) {
      return "To track your order, please provide your order number and I'll help you check its status.";
    } else if (lowerMessage.includes("return")) {
      return "Our return policy allows returns within 30 days of purchase. Would you like to know more details?";
    } else if (lowerMessage.includes("payment")) {
      return "I can help you with payment related issues. Could you please specify your concern?";
    } else if (lowerMessage.includes("contact")) {
      return "You can reach our support team at support@example.com or call us at 1-800-123-4567.";
    }
    return "I understand your query. How else can I assist you?";
  }

  private scrollToBottom() {
    try {
      this.scrollContainer.nativeElement.scrollTop = 
        this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

}
