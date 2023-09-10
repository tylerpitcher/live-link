import { ListItem, styled } from '@mui/material';

const StyledListItem = styled(ListItem)((style) => ({
  border: `1px solid ${style.theme.palette.divider}`,
  borderRadius: style.theme.shape.borderRadius,
  marginBottom: style.theme.spacing(1),
}));

export default StyledListItem;
