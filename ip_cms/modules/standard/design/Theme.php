<?php
/**
 * @package ImpressPages
 *
 */

namespace Modules\standard\design;


class Theme
{
    const INSTALL_DIR = 'install/';
    const PARAMETERS_FILE = 'parameters.php';

    protected $name;
    protected $title;
    protected $doctype;
    protected $version;
    protected $thumbnail;
    protected $authorTitle;
    protected $options;

    public function __construct(ThemeMetadata $metadata)
    {
        $properties = $metadata->getMetadata();
        foreach ($properties as $key => $value) {
            $this->$key = $value;
        }
    }

    public function getThumbnailUrl()
    {
        return BASE_URL . THEME_DIR . $this->name . "/install/" . $this->thumbnail;
    }

    public function getName()
    {
        return $this->name;
    }

    public function getTitle()
    {
        return $this->title;
    }

    public function getDoctype()
    {
        return $this->doctype;
    }

    public function getVersion()
    {
        return $this->version;
    }

    public function getAuthorTitle()
    {
        return $this->authorTitle;
    }

    public function getOptions()
    {
        if (!$this->options) {
            return array();
        }
        return $this->options;
    }

}