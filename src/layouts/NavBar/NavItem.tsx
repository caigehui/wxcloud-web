import React, { useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Button, Collapse, ListItem, makeStyles } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import * as Icon from 'react-feather';

const useStyles = makeStyles(theme => ({
  item: {
    display: 'block',
    paddingTop: 0,
    paddingBottom: 0,
  },
  itemLeaf: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0,
  },
  button: {
    color: theme.palette.text.secondary,
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
  },
  buttonLeaf: {
    color: theme.palette.text.secondary,
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightRegular,
    '&.depth-0': {
      '& $title': {
        fontWeight: theme.typography.fontWeightMedium,
      },
    },
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1),
  },
  title: {
    marginRight: 'auto',
  },
  active: {
    color: theme.palette.secondary.main,
    '& $title': {
      fontWeight: theme.typography.fontWeightMedium,
    },
    '& $icon': {
      color: theme.palette.secondary.main,
    },
  },
}));

function NavItem({
  name,
  path,
  depth,
  children,
  icon,
  className,
  open: openProp,
  ...rest
}: {
  [key: string]: any;
}) {
  const classes = useStyles();
  const [open, setOpen] = useState(openProp);

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  let paddingLeft = 8;

  if (depth > 0) {
    paddingLeft = 32 + 8 * depth;
  }

  const style = { paddingLeft };

  const ElIcon = Icon[icon];

  if (children) {
    return (
      <ListItem key={path} className={clsx(classes.item, className)} disableGutters {...rest}>
        <Button className={classes.button} onClick={handleToggle} style={style}>
          {ElIcon && <ElIcon className={classes.icon} size="20" />}
          <span className={classes.title}>{name}</span>
          {open ? <ExpandLessIcon color="inherit" /> : <ExpandMoreIcon color="inherit" />}
        </Button>
        <Collapse in={open}>{children}</Collapse>
      </ListItem>
    );
  }

  return (
    <ListItem className={clsx(classes.itemLeaf, className)} disableGutters key={path} {...rest}>
      <Button
        activeClassName={classes.active}
        className={clsx(classes.buttonLeaf, `depth-${depth}`)}
        component={RouterLink}
        exact
        style={style}
        to={path}
      >
        {ElIcon && <ElIcon className={classes.icon} size="20" />}
        <span className={classes.title}>{name}</span>
      </Button>
    </ListItem>
  );
}

NavItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  depth: PropTypes.number.isRequired,
  path: PropTypes.string,
  icon: PropTypes.string,
  open: PropTypes.bool,
  name: PropTypes.string.isRequired,
};

NavItem.defaultProps = {
  open: false,
};

export default NavItem;
