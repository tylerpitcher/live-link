import { CardHeader, styled} from '@mui/material';

const StyledCardHeader = styled(CardHeader)((style) => ({
  color: style.theme.palette.primary.main,
}));

export default StyledCardHeader;
