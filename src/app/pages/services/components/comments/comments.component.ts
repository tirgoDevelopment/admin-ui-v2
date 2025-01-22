import { Component, Input, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { IconsProviderModule } from 'src/app/shared/modules/icons-provider.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzCommentModule } from 'ng-zorro-antd/comment';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  standalone: true,
  imports: [CommonModules, NzModules, TranslateModule, IconsProviderModule, PipeModule, NzListModule, NzCommentModule],
})
export class ServiceCommentsComponent implements OnInit{
  @Input() serviceId: number;
  data = [
    {
      author: 'Han Solo',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      content:
        'We supply a series of design principles, practical patterns and high quality design resources' +
        '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
        displayTime: '21-05-2022 21:00'
    },
    {
      author: 'Han Solo',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      content:
        'We supply a series of design principles, practical patterns and high quality design resources' +
        '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
        displayTime: '21-05-2022 21:00'
      },
      {
        author: 'Han Solo',
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        content:
          'We supply a series of design principles, practical patterns and high quality design resources' +
          '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
          displayTime: '21-05-2022 21:00'
      },
      {
        author: 'Han Solo',
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        content:
          'We supply a series of design principles, practical patterns and high quality design resources' +
          '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
          displayTime: '21-05-2022 21:00'
        },
        {
          author: 'Han Solo',
          avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
          content:
            'We supply a series of design principles, practical patterns and high quality design resources' +
            '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
            displayTime: '21-05-2022 21:00'
        },
        {
          author: 'Han Solo',
          avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
          content:
            'We supply a series of design principles, practical patterns and high quality design resources' +
            '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
            displayTime: '21-05-2022 21:00'
          },
          {
            author: 'Han Solo',
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            content:
              'We supply a series of design principles, practical patterns and high quality design resources' +
              '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
              displayTime: '21-05-2022 21:00'
          },
          {
            author: 'Han Solo',
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            content:
              'We supply a series of design principles, practical patterns and high quality design resources' +
              '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
              displayTime: '21-05-2022 21:00'
            },
            {
              author: 'Han Solo',
              avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
              content:
                'We supply a series of design principles, practical patterns and high quality design resources' +
                '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
                displayTime: '21-05-2022 21:00'
            },
            {
              author: 'Han Solo',
              avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
              content:
                'We supply a series of design principles, practical patterns and high quality design resources' +
                '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
                displayTime: '21-05-2022 21:00'
              },
              {
                author: 'Han Solo',
                avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                content:
                  'We supply a series of design principles, practical patterns and high quality design resources' +
                  '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
                  displayTime: '21-05-2022 21:00'
              },
              {
                author: 'Han Solo',
                avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                content:
                  'We supply a series of design principles, practical patterns and high quality design resources' +
                  '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
                  displayTime: '21-05-2022 21:00'
                },
                {
                  author: 'Han Solo',
                  avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                  content:
                    'We supply a series of design principles, practical patterns and high quality design resources' +
                    '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
                    displayTime: '21-05-2022 21:00'
                },
                {
                  author: 'Han Solo',
                  avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                  content:
                    'We supply a series of design principles, practical patterns and high quality design resources' +
                    '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
                    displayTime: '21-05-2022 21:00'
                  },
                  {
                    author: 'Han Solo',
                    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                    content:
                      'We supply a series of design principles, practical patterns and high quality design resources' +
                      '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
                      displayTime: '21-05-2022 21:00'
                  },
                  {
                    author: 'Han Solo',
                    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                    content:
                      'We supply a series of design principles, practical patterns and high quality design resources' +
                      '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
                      displayTime: '21-05-2022 21:00'
                    },
                    {
                      author: 'Han Solo',
                      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                      content:
                        'We supply a series of design principles, practical patterns and high quality design resources' +
                        '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
                        displayTime: '21-05-2022 21:00'
                    },
                    {
                      author: 'Han Solo',
                      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                      content:
                        'We supply a series of design principles, practical patterns and high quality design resources' +
                        '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
                        displayTime: '21-05-2022 21:00'
                      },
                      {
                        author: 'Han Solo',
                        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                        content:
                          'We supply a series of design principles, practical patterns and high quality design resources' +
                          '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
                          displayTime: '21-05-2022 21:00'
                      },
                      {
                        author: 'Han Solo',
                        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                        content:
                          'We supply a series of design principles, practical patterns and high quality design resources' +
                          '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
                          displayTime: '21-05-2022 21:00'
                        },
      
  ];
  inputValue = '';
  loading = false;
  user = {
    name: 'John Doe',
    avatar: 'https://joeschmoe.io/api/v1/random',
  };
  constructor() {}
  ngOnInit(): void {
      console.log(this.serviceId);
      
  }

}
