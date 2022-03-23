import fetch from '@/utils/http/axios';

const group = {
  getGroupsByName(groupName: string) {
    return fetch.get('/group/findByName', {
      params: { groupName },
    });
  },
};

export default group;
