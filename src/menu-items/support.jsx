// assets
import { ChromeOutlined, QuestionOutlined } from '@ant-design/icons';

// icons
const icons = {
  ChromeOutlined,
  QuestionOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const support = {
  id: 'support',
  // title: 'Support',
  type: 'group',
  children: [
    {
      id: 'class-page',
      title: 'Class Page',
      type: 'item',
      url: '/class-page',
      icon: icons.ChromeOutlined
    },
    {
      id: 'student-page',
      title: 'Student Page',
      type: 'item',
      url: '/student-page',
      icon: icons.ChromeOutlined
    },
    // {
    //   id: 'documentation',
    //   title: 'Documentation',
    //   type: 'item',
    //   url: 'https://codedthemes.gitbook.io/mantis/',
    //   icon: icons.QuestionOutlined,
    //   external: true,
    //   target: true
    // }
  ]
};

export default support;
