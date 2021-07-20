import createFromIconfontCN from '@ant-design/icons/es/components/IconFont';

const BraveIcon = createFromIconfontCN({
  extraCommonProps: {
    className: 'brave-icon',
  },
  scriptUrl: '/shared/js/brave-font.min.js',
});

export default BraveIcon;
